const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function handlePostPreference(request, h) {
    try{
        const {name,dob,teach,learn,hobbies,skills} = request.payload;
        const {userid} = request.auth.credentials;

        const check = await prisma.preferences.findMany({
            where:{
                user_id:userid,
            },
        });

        if (check.length>0) {
            return h.response({ message: 'Preferences already exist for this user' }).code(409);
        }

        await prisma.preferences.create({
            data:{
                user_id:userid,
                name:name,
                dob:dob,
                teach:teach,
                learn:learn,
            },
        })
        const hobby_data = hobbies.map((ele_hobby)=>{
            return {
                user_id:userid,
                hobby:ele_hobby,
            }
        })
        const skills_data = skills.map((ele_skill)=>{
            return {
                user_id:userid,
                skill:ele_skill,
            }
        })

        await prisma.hobbies.createMany({
            data: hobby_data,
            skipDuplicates: true, 
        })
        await prisma.skills.createMany({
            data: skills_data,
            skipDuplicates: true, 
        })

        return h.response({msg:"preferences added successfully"}).code(200);
    }
    catch(err){
        return h.response({"error":err.message}).code(404);
    }
    
}

async function handleGetPreference(request, h) {
    try{
        const { userid } = request.auth.credentials; 
        
        const preference = await prisma.preferences.findMany({
            where:{
                user_id:userid,
            },
        });
        if (!preference) {
            return h.response({ error: 'Preferences not found for this user' }).code(404);
        }

        return h.response(preference).code(200);
    }
    catch(err){
        return h.response({"error":err}).code(404);
    }
    
}

module.exports = {
    handlePostPreference,
    handleGetPreference,
}

