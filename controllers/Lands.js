import Land from "../models/LandModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getLands = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin" || req.role === "user"){
            response = await Land.findAll({
                attributes:['uuid','nama_lahan','nama_pemilik','harga_sewa','lokasi','tanggal_awal','tanggal_selesai','luas_lahan','keterangan','status','image','createdAt'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getLandById = async(req, res) =>{
    try {
        const land = await Land.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!land) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin" || req.role === "user"){
            response = await Land.findOne({
                attributes:['uuid','nama_lahan','nama_pemilik','harga_sewa','lokasi','tanggal_awal','tanggal_selesai','luas_lahan','keterangan','status','image'],
                where:{
                    id: land.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createLand = async(req, res) =>{
    const {nama_lahan, nama_pemilik, harga_sewa, lokasi, tanggal_awal, tanggal_selesai, luas_lahan, keterangan, status, image} = req.body;
    try {
        await Land.create({
            nama_lahan: nama_lahan,
            nama_pemilik: nama_pemilik,
            harga_sewa: harga_sewa,
            lokasi: lokasi,
            tanggal_awal: tanggal_awal,
            tanggal_selesai: tanggal_selesai,
            luas_lahan: luas_lahan,
            keterangan: keterangan,
            status: status,
            image: image,
            userId: req.userId
        });
        res.status(201).json({msg: "Land Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateLand = async(req, res) =>{
    try {
        const land = await Land.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!land) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {nama_lahan, nama_pemilik, harga_sewa, lokasi, tanggal_awal, tanggal_selesai, luas_lahan, keterangan, status, image} = req.body;
        if(req.role === "admin"){
            await Land.update({nama_lahan, nama_pemilik, harga_sewa, lokasi, tanggal_awal, tanggal_selesai, luas_lahan, keterangan, status, image},{
                where:{
                    id: land.id
                }
            });
        }
        res.status(200).json({msg: "Land updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteLand = async(req, res) =>{
    try {
        const land = await Land.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!land) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {nama_lahan, nama_pemilik, harga_sewa, lokasi, tanggal_awal, tanggal_selesai, luas_lahan, keterangan, status, image} = req.body;
        if(req.role === "admin"){
            await Land.destroy({
                where:{
                    id: land.id
                }
            });
        }
        res.status(200).json({msg: "Land deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const rentalLand = async(req, res) =>{
    try {
        const land = await Land.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!land) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {tanggal_awal, tanggal_selesai, status} = req.body;
        await Land.update({tanggal_awal, tanggal_selesai},{
            where:{
                id: land.id
            }
        });
        res.status(200).json({msg: "Lahan berhasil disewa! Selanjutnya tinggal bayar!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
