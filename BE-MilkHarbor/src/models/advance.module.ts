import {Schema, model} from 'mongoose'

export interface Advance{
    id:String;
    type:String;
    descp:String;
    status:String;
    username:String;
    amount:Number;
}
export const AdvanceSchema= new Schema({
    type:{
        type:String,
        required:true,
    },
    descp:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    amount:{
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
export const AdvanceModel=model<Advance>('advances',AdvanceSchema)