import styles from "./Header.module.css"

export default function Header() {
  return (
    <header className={styles.headerContainer}>
        <img className={styles.logo} src="https://www.turners.co.nz/assets/images/logo/square_logo_car.png" alt="Turners car insurance logo" />
        <div className={styles.navs}>
            <ul>
                <li>Home</li>
                <li>Insurances</li>
                <li>Contact</li>
                <li>About</li>
            </ul>
        </div>
        <div className={styles.btnContainer}>
            <button className={styles.btns}>Login</button>
            <button className={styles.btns}>Sign Up</button>
        </div>
    </header>
  )
}