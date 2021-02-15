import {StyleSheet,css} from "aphrodite";

const LangSwitcher = ({lang, className,onLangSwitch})=>{
    return <div className={`${className} ${css(styles.container)}`}>
        {lang==='TH'?
            <><span className='btn btn-success disabled'>TH</span> | <a href="#" className={css(styles.a)} onClick={e=>{
                e.preventDefault();
                if(onLangSwitch)onLangSwitch('EN');
            }}>EN</a></>
            :
            <><a href="#" className={css(styles.a)} onClick={e=>{
                e.preventDefault();
                if(onLangSwitch)onLangSwitch('TH');
            }}>TH</a> | <span className='btn btn-success disabled'>EN</span></>
        }
    </div>
}
LangSwitcher.defaultProps={
    lang:'TH'
};
const styles=StyleSheet.create({
    container:{
        display:'inline-block',
        border:'1px solid #ccc',
        borderRadius:'5px',
        padding:'3px'
    },
    a:{
        textDecoration:'none',
        padding:'5px',
    }
});
export default LangSwitcher;