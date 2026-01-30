import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className="container">
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.description}>
          The page you are looking for could not be found. It might have been
          moved, deleted, or never existed.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeLink}>
            Go Home
          </Link>
          <Link href="/cars" className={styles.browseLink}>
            Browse Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
}
