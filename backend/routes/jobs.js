const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs')

// route1
router.post('/', async(req,res)=>{
    try{
        req.body.createdBy = req.user.userId;
        const job = await Job.create(req.body);
        res.status(201).json({job});
    }
    catch(error){
        res.status(500).json({msg: error.message});
    }
});


// route2
router.get('/', async(req,res)=>{
    try{
        const jobs = await Job.find({createdBy:req.user.userId}).sort({createdAt: -1}); // gget all jobs newest job first
        res.status(200).json({count: jobs.length,jobs});
    }
    catch(error){
        res.status(500).json({sg: error.message});
    }
});


// route3 update a job

router.patch('/:id', async(req,res)=>{
    try{

        const {user:{userId},params:{id:jobId}} = req;

        const job = await Job.findByIdAndUpdate(
            { _id: jobId, createdBy: userId },
            req.body,
            { new: true, runValidators: true }
        );

        if(job==null){
            return res.status(404).json({msg:`no jobs with id: ${jobId}`});

        }
        res.status(200).json({job});

    }
    catch(error){
        res.status(500).json({msg:error.message});
    }
});


// rout4 delete
router.delete('/:id', async (req, res) => {
    try {
        const { user: { userId }, params: { id: jobId } } = req;

        // Only delete if it belongs to this user
        const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

        if (!job) {
            return res.status(404).json({ msg: `No job with id ${jobId}` });
        }
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
