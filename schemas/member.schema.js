const { Schema, model } = require('mongoose')

const bcrypt = require('bcrypt')

const MembersSchema = new Schema(

  {
    username: { type: String, isRequired: true },
    password: { type: String, isRequired: true },
  },
  {
    timestamps: true,
  }
)

MembersSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

MembersSchema.methods.isValidPassword = async function (password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

const Members = model('Members', MembersSchema)

module.exports = { Members, MembersSchema }
