import Redis from "ioredis";

const client = new Redis({
    username: "default",
    password: "9jtnCI0eAUCbzaokaBwYiBqY12DXJYok",
    host: "redis-18447.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    port: "18447",

})

client.connect(() => {
    console.log("Redis Connected ");
})

export default client



