import History from "../models/HistoryModel.js";
import Transactions from "../models/TransactionModel.js";
import Land from "../models/LandModel.js";

export const getHistory = async (req, res) => {
    try {
        const history = await History.findAll({
            where: { uuid: req.params.id },
            attributes: ['uuid', 'tanggal_transaksi', 'userId', 'transactionId', 'lahanId', 'status_transaksi', 'status_lahan', 'nama_lahan', 'tanggal_expired'],
            include: [
                { 
                    model: Transactions,
                    attributes: ['uuid', 'tanggal_transaksi', 'total_harga_sewa', 'status_transaksi', 'sewa_expired', 'bukti_pembayaran']
                },
                {
                    model: Land,
                    attributes: ['nama_lahan', 'status']
                }
            ]
        });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
