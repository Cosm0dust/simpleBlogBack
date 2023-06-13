import PostModel from "../models/Post.js";

export const getAll = async (req, res) =>{
    try{
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (err){
        console.log(err)
        res.status(500).json({
            message: "cant get articles"
        })
    }
}

export const  getLastTags = async (req, res)=>{
    try{
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts.map(obj => obj.tags).flat().slice(0,5)

        res.json(tags)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: "cant delete articles"
        })
    }
}

export const remove = async (req, res) =>{
    try{
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId
        }).then(()=> res.json({
            success: true
        })).catch(err=> {
            console.log(err)
            return  res.status(500).json({
                message: "cant delete the articles"
            })
        })


    } catch (err){
        console.log(err)
        res.status(500).json({
            message: "cant delete articles"
        })
    }
}

export const getOne = async (req, res) =>{
    try{
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            { _id: postId } ,{ $inc: { viewsCount: 1 } },{ returnDocument: "After" } ).populate('user')
            .then(doc => res.json(doc))
            .catch(err => res.status(500).json({ message: "Статья не найдена" }))

    } catch (err){
        console.log(err)
        res.status(500).json({
            message: "cant get articles"
        })
    }
}


export const create = async (req, res)=>{
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post)
    } catch (err){
        console.log(err)
        res.status(500).json({
            message:"cant make an article"
        })
    }
}

export const update= async (req, res)=> {
    try{
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        },{
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        res.json({
            success: true
        })
    } catch (err){
        console.log(err)
        res.status(500).json({
            message:"cant update the article"
        })
    }
}