import styles from './styles/MainPage.module.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = import.meta.env.VITE_SP_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SITE_URL + 'create';
const scopes = ['playlist-modify-public'];

const MainPage = () => {
  return (
    <div className="container-sm" style={{ marginBottom: 50 }}>
      <div className="container-sm">
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>What&apos;s Record Shop?</h3>
          <br />
          <p className={styles.subtitle}>Record Shop helps you find new music.</p>
          <br />
          <p className={styles.subtitle}>
            Pick a city from the tabs above and check out the upcoming concert listings.
          </p>
        </div>
        <br />

        <div className={styles.createContainer}>
          <p className={styles.create}>
            Create a new playlist on your spotify account with the top track from each artist playing in your chosen
            city.
          </p>
        </div>
        <br />

        <div className={styles.welcomeContainer}>
          <p className={styles.loginMessage}>Let&apos;s start by logging into Spotify.</p>

          <button className={styles.login}>
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                '%20',
              )}&response_type=token&show_dialog=true`}
            >
              <p className={styles.buttonText}>Login to Spotify</p>
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
