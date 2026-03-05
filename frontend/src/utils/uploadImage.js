import axiosInstance from "./axiosinstancs";

const uploadImage =async (imagefile)=>{
    const formdata=new FormData();
    formdata.append('image',imagefile);
    try{
        const response = await axiosInstance.post('/post-image',formdata,{
            headers:{
                'Content-type':'multipart/form-data',
            },
        });
        return response.data;
    }catch(error){
        console.log("Error uploading the image",error);
        throw error;
    }
};
export default uploadImage;