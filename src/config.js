const Config={
    adminPath:(path)=>{
        if(path){
            return '/admin'+path
        }
        return '/admin';
    },
    baseUrl:'https://ems.kku.ac.th',
    basePath:'/v2'
};
export default Config
