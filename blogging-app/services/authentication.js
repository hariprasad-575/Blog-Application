const JWT=require('jsonwebtoken')

const secret="qazwsxedc123!@#"

function createTokenUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImgUrl:user.profileImgUrl,
        role:user.role
    }

    const token=JWT.sign(payload,secret)
    return token;
}


function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={createTokenUser,validateToken}