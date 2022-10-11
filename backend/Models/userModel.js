const mongoose= require ("mongoose");
const userSchema= mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
      },
      confirmationCode: { 
        type: String, 
        unique: true },
    pic:{type: String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}    
}, {
    timestamps: true,
    toJSON: {virtuals: true}
});
const User=mongoose.model("User", userSchema);

module.exports = User;