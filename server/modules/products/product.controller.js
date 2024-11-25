const Model=require('./product.model')
// const { Types } = require('mongoose');
// const { ObjectId } = Types;


const create=(payload)=>{
    return Model.create(payload)
}
const list = async(limit,page,search)=>{

    const pageNum = parseInt(page) || 1;
    const size= parseInt(limit) || 5;
     let { name,isArchived} = search ;
    const query = [];
    if (name) {
        
    

    query.push(
        {
            '$match': {
                name:new RegExp(name, "gi"),
            },
        });
    }
       query.push( 
        {
            '$match': {
                isArchived:Boolean(isArchived)|| false, 
            },
        },
        {
            '$sort': {
                created_at: 1,
            },
        },
        {
            '$facet': {
                'metadata': [
                    {
                        '$count': 'total'
                    }
                ],
                'data': [
                    {
                        '$skip': (pageNum - 1) * size
                    },
                    {
                        '$limit': size
                    }
                ]
            }
        },
        {
            '$addFields': {
                'total': {
                    '$arrayElemAt': ['$metadata.total', 0]
                }
            }
        },
        {
            '$project': {
                'data': 1,
                'total': 1
            }
        },
        {
            '$project': {
                'data.password': 0,
            },
        },
    );
   const response= await Model.aggregate(query).allowDiskUse(true);
    const newData = response[0] || { data: [], total: 0 };
    const { data, total } = newData;
    return { data, total: total || 0, limit, pageNum };
}
const getById=async(id)=>{
    // const objectId = new ObjectId(id);
    // const result = await Model.aggregate([
    //     {
    //       $match: {
    //         _id: objectId,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "categories",
    //         localField: "category",
    //         foreignField: "_id",
    //         as: "category_name",
    //       },
    //     },
    //     {
    //       $unwind: {
    //         path: "$category_name",
    //         preserveNullAndEmptyArrays: false,
    //       },
    //     },
    //     {
    //       $addFields: {
    //         category_name: "$category_name.name",
    //       },
    //     },
    //   ]);
    //   if (result?.length === 0) return {};
    //   return result[0];
    
    return Model.findOne({_id:id});
     };
    
 
const updateById=(id,payload)=>{

    return Model.findOneAndUpdate({_id:id},payload,{new:true});
    
}
const deleteById=(id,payload)=>{

    return Model.findOneAndUpdate({_id:id},payload,{new:true});

}


module.exports={create,list,getById,updateById,deleteById}
