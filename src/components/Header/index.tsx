import styles from './header.module.scss'

export default function Header() {
 
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img src="/spacetraveling.svg" alt="logo" />
      </div>
    </header>
  )
}
