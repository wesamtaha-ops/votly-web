import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import EditProfile from '../components/EditProfile/EditProfile';

export default function EditProfilePage() {
  // Assume `user` is fetched from an API or context
  const user = {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    birthday: '1990-01-01',
    gender: 'male',
    bio: 'Lover of polls and surveys.',
  };

  return (
    <>
      <Header />
      <main className='main-content'>
        <EditProfile user={user} />
      </main>
      <Footer />
    </>
  );
}
