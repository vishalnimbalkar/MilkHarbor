import {Schema, model} from 'mongoose'

export interface MilkCollection{
    milk_coll_id:String;
    f_id:String;
    milk_fat:Number;
    milk_qnt:Number;
    milk_snf:Number;
    price_per_liter:Number;
    total:Number;
}
export const MilkCollectionSchema= new Schema({
    f_id:{
        type:String,
        required:true
    },
    milk_fat:{
        type:Number,
        required:true
    },
    milk_qnt:{
        type:Number,
        required:true,
        unique:true
    },
    milk_snf:{
        type:Number,
        required:true,
    },
    price_per_liter:{
        type:Number,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    }
},{
    toJson:{
        virtuals:true
    },
    toObjects:{
        virtuals:true
    },
    timestamps:true
})
export const milkCollectionModel=model<MilkCollection>('milkcollections',MilkCollectionSchema)