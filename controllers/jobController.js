

//add job controller

const jobs = require("../model/jobModal");

exports.addJobController = async(req,res)=>{
    const {title, location, jType, salary, qualification, experience, description} = req.body

    console.log(title, location, jType, salary, qualification, experience, description);
    
    try {
        const existingJob = await jobs.findOne({title,location})
        if(existingJob){
            res.status(400).json('Job already added')
        }
        else{
            const newJob = new jobs({
                title, location, jType, salary, qualification, experience, description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all job controller

exports.getAllJobsController = async (req,res)=>{
    const searchKey = req.query.search
    console.log(searchKey);
    
    try {
        const alljobs = await jobs.find({title:{$regex:searchKey,$options:'i'}})
        res.status(200).json(alljobs)

    } catch (error) {
      res.status(500).json(error)  
    }
}

//delete a job
exports.deleteAJobController = async (req, res)=>{
    const {id} = req.params
try {
    await jobs.findByIdAndDelete({_id:id})
    res.status(200).json('Deleted successfully')
} catch (error) {
    res.status(500).json(error)
}
}