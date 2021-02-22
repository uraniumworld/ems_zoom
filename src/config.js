import packageJson from './../package.json';
const Config={
    adminPath:(path)=>{
        if(path){
            return '/admin'+path
        }
        return '/admin';
    },
    baseUrl:'https://ems.kku.ac.th',
    basePath:packageJson.homepage,
    maxUploadSize:10//MB
};
export default Config
