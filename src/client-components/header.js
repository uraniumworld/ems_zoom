import { StyleSheet, css } from 'aphrodite';
const Header = ()=>{
    return <div className={css(styles.main)}>
        <span>EMS Schedules</span>
    </div>
}
const styles = StyleSheet.create({
    main:{
        height:'100px',
        background:'#ca640e',
    }
})
export default Header;