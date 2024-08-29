import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Profile from '../components/Profile/Profile';

export default function ProfilePage() {
  // Assume `user` is fetched from an API or context
  const user = {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    birthday: '1990-01-01',
    gender: 'male',
    usertype: 'voter',
    bio: 'Lover of polls and surveys.',
    facebook: 'https://facebook.com/johndoe',
    instagram: 'https://instagram.com/johndoe',
    youtube: 'https://youtube.com/johndoe',
  };

  return (
    <>
      <Header />
      <main className='main-content'>
        <Profile user={user} />
      </main>
      <Footer />
    </>
  );
}
