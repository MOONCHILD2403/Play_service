const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function handleSimilarProfiles(request, h) {
    try{
        const email = request.payload.email;
        const user = await prisma.users.findUnique({
            where:{
                email:email,
            },
        })
        const userid = user.id;
        const [preference, user_skills, user_hobbies] = await Promise.all([
            prisma.preferences.findMany({ where: { user_id: userid } }),
            prisma.skills.findMany({ where: { user_id: userid }, select: { skill: true } }),
            prisma.hobbies.findMany({ where: { user_id: userid }, select: { hobby: true } }),
        ]);

        if (!preference) {
            return h.response({ error: 'No preferences found for this user' }).code(404);
        }

        const skills = user_skills.map((row)=>{
            return row.skill;
        });
        const hobbies = user_hobbies.map((row)=>{
            return row.hobby;
        });

        const [similar_hobbies, similar_skills] = await Promise.all([
            prisma.hobbies.findMany({ where: {user_id: {not: userid}, hobby: {in: hobbies}}, select: {user_id: true}}),
            prisma.skills.findMany({ where: {user_id: {not: userid}, skill: {in: skills}}, select: {user_id: true}}),
        ]);
        
        const people = new Set([
            ...similar_hobbies.map(row => row.user_id),
            ...similar_skills.map(row => row.user_id),
        ]);

        const data = await prisma.preferences.findMany({
            where:{
                user_id:{
                    in:Array.from(people),
                }
            }
        })
        return h.response(data).code(200);
    }
    catch(err){
        return h.response({"error":err.message}).code(404);
    }
    
}

module.exports = {
    handleSimilarProfiles,
}

