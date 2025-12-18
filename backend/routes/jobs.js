const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs')

// route1
router.post('/', async(req,res)=>{
    try{
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
        const jobs = await Job.find().sort({createdAt: -1}); // gget all jobs newest job first
        res.status(200).json({count: jobs.length,jobs});
    }
    catch(error){
        res.status(500).json({sg: error.message});
    }
});


// route3 update a job

router.patch('/:id', async(req,res)=>{
    try{

        const {id} = req.params;

        const job = await Job.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators: true
        });

        if(job==null){
            return res.status(404).json({msg:`no jobs with id: ${id}`});

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
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ msg: `No job with id: ${id}` });
    }
    res.status(200).send('Job deleted');
    
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
