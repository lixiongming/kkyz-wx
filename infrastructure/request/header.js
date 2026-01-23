
export  default function getHeader(header = {}){
    return Object.assign(header, {
        Authorization :  uni.$store.userStore.token,
    })			
}