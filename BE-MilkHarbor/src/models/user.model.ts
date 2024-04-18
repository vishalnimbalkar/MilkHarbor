import {Schema, model} from 'mongoose'

export interface User{
    id:string;
    name:string;
    address:string;
    m_no:string;
    email:string;
    username:string,
    password:string;
    role:string;
    status:string;
    is_active:boolean;
}

export const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    m_no:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    is_active:{
        type:Boolean,
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
export const userModel=model<User>('users',userSchema)