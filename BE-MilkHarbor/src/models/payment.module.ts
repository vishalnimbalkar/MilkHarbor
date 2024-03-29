import {Schema, model} from 'mongoose'

export interface Payment{
    id:String;
    f_id:String;
    a_id:String;
    status:String,
    milk_coll_id:String;
    total_price:Number;
    payment_status:String;
}
export const PaymentSchema= new Schema({
    f_id:{
        type:String,
        required:true
    },
    a_id:[{
        type: Schema.Types.ObjectId,
        ref: 'advances' // Reference to another Mongoose model
    }],
    status:{
        type:String,
        required:true
    },
    milk_coll_id:[{
        type: Schema.Types.ObjectId,
        ref: 'milkcollections' // Reference to another Mongoose model
    }],
    total_price:{
        type:Number,
        required:true,
    }  ,
    payment_status:{
        type:String,
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
export const PaymentModel=model<Payment>('payments',PaymentSchema)