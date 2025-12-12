import pool from "../config/db";

export async function getOrCreateAndIncrement(type, key, windowstart) {
    const conn = await pool.getConnection();
    try{
        await conn.beginTransaction();

        const[rows]= await conn.execute(
            "SELECT count FROM rate_limits WHERE type =?AND `key`=?AND window_start =? FOR UPDATE",
            [type, key, windowstart]
        );
        if(rows.length ===0){
            await conn.execute(
                "INSERT INTO rate_limits(type,`key`,window_start,count) VALUES(?,?,?,1)",
                [type, key, windowstart]
            );

            await conn.commit();
            return 1;
        }
        const newCount = rows[0].count + 1;
        await conn.execute(
            "UPDATE rate_limits SET count =?WHARE type =? ANd  `key`= ? aND window_start =?",
            [newCount, type, key,windowstart]
        ) ;

        await conn.commit();
        return newCount;


        
    }catch(err){
        await conn.rollback();
        throw err;


    }finally{
        conn.release();
    }
    
}