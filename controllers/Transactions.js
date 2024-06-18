import Transaction from "../models/TransactionModel.js";
import Land from "../models/LandModel.js";
import History from "../models/HistoryModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

// Function to calculate the difference in days between two dates
const calculateDateDifference = (startDate, endDate) => {
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTransactions = async (req, res) => {
    try {
        let transactions;

        if (req.role === "admin") {
            transactions = await Transaction.findAll({
                attributes: ['uuid', 'tanggal_transaksi', 'total_harga_sewa', 'status_transaksi', 'sewa_expired', 'bukti_pembayaran'],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email']
                    },
                    {
                        model: Land,
                        attributes: ['nama_lahan', 'lokasi']
                    }
                ]
            });
        } else if (req.role === "user") {
            transactions = await Transaction.findAll({
                attributes: ['uuid', 'tanggal_transaksi', 'total_harga_sewa', 'status_transaksi', 'sewa_expired', 'bukti_pembayaran'],
                where: {
                    userId: req.userId
                },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email']
                    },
                    {
                        model: Land,
                        attributes: ['nama_lahan', 'lokasi']
                    }
                ]
            });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: ['uuid', 'tanggal_transaksi', 'total_harga_sewa', 'status_transaksi', 'sewa_expired', 'bukti_pembayaran'],
            include: [
                {
                    model: User,
                    attributes: ['name', 'email']
                },
                {
                    model: Land,
                    attributes: ['nama_lahan', 'lokasi']
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTransaction = async (req, res) => {
    const { bukti_pembayaran, landId } = req.body;

    try {
        const land = await Land.findOne({
          where: { uuid: landId }
        });

        if (!land) {
            return res.status(404).json({ msg: "Data tanah tidak ditemukan" });
        }

        if (land.status === 'telah disewa') {
          return res.status(400).json({ msg: "Tanah ini sudah disewa" });
      }

        // Calculate total harga sewa
        const selisihHari = calculateDateDifference(land.tanggal_awal, land.tanggal_selesai);
        const total_harga_sewa = selisihHari * land.harga_sewa;

        // Create the transaction
        const transaction = await Transaction.create({
            tanggal_transaksi: new Date(), // auto
            total_harga_sewa: total_harga_sewa, // auto
            status_transaksi: 'pending', // Default status pending saat transaksi dibuat
            sewa_expired: land.tanggal_selesai, // auto
            bukti_pembayaran: bukti_pembayaran,
            userId: req.userId,
            landId: land.id
        });

        // Update the land status to "telah disewa"
        await Land.update({ status: 'telah disewa' }, {
            where: {
                uuid: land.uuid
            }
        });

        // Create history for the transaction
        await History.create({
          tanggal_transaksi: transaction.tanggal_transaksi,
          userId: req.userId,
          transactionId: transaction.id,
          landId: land.id,
          nama_lahan: land.nama_lahan,
          tanggal_expired: transaction.sewa_expired
        });

        res.status(201).json({ msg: "Transaction created successfully", transaction });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateTransactionStatus = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!transaction) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        const { status_transaksi } = req.body;

        if (req.role === "admin") {
            await Transaction.update({ status_transaksi }, {
                where: {
                    uuid: req.params.id
                }
            });
        }

        res.status(200).json({ msg: "Transaction status updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    const transaction = await Transaction.findOne({
      where: {
        uuid: req.params.id
      }
    });
    if (!transaction) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
    await Transaction.destroy({
      where: {
        uuid: req.params.id
      }
    });
    res.status(200).json({ msg: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
