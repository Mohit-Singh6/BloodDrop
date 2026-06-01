import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const IMAGES = {
  hero: 'https://media.istockphoto.com/id/1328426310/photo/red-blood-shape-in-humans-hand-for-world-blood-donor-day-and-save-life-concept-blood-donation.jpg?s=612x612&w=0&k=20&c=cCaEOKox791XF6Zhv7xM1ZO9IqkDqHoJpsxPEuv0Z8w=',
  donor: 'https://media.istockphoto.com/id/2162481330/photo/taking-blood-sample-from-a-patient-in-the-hospital.jpg?s=612x612&w=0&k=20&c=PZkrNRqeeY0kY6bSZuuolTdZ8-QrdfDlObir49jasr8=',
  request: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
  hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
};

const FEATURES_GUEST = [
  {
    img: IMAGES.donor,
    title: 'For Donors',
    text: 'Register your blood type and location. Get notified when someone nearby needs your help.',
  },
  {
    img: IMAGES.request,
    title: 'For Requesters',
    text: 'Post urgent blood requests and reach compatible donors in your area within minutes.',
  },
  {
    img: IMAGES.hospital,
    title: 'For Hospitals',
    text: 'Manage blood inventory, track stock levels, and coordinate emergency requests at scale.',
  },
];

const STEPS_GUEST = [
  { title: 'Sign up', text: 'Create an account as a donor, requester, or hospital partner.' },
  { title: 'Connect', text: 'We match blood types and locations to find the right people fast.' },
  { title: 'Save lives', text: 'Respond to invites or requests and make a real difference today.' },
];

const getWelcome = (role, isHospital) => {
  if (role === 'donor') {
    return {
      message: (
        <>
          <strong>Welcome back, hero.</strong> Keep your health profile up to date so we can match you with nearby emergency requests.
        </>
      ),
    };
  }
  if (role === 'admin') {
    return {
      message: (
        <>
          <strong>Admin dashboard.</strong> Monitor platform activity and manage users from your control panel.
        </>
      ),
    };
  }
  if (isHospital) {
    return {
      message: (
        <>
          <strong>Hospital partner.</strong> Track inventory, submit emergency requests, and coordinate with donors in your region.
        </>
      ),
    };
  }
  return {
    message: (
      <>
        <strong>Requester account.</strong> When blood is needed urgently, submit a request and we will notify compatible donors near you.
      </>
    ),
  };
};

const getHero = (token, role, isHospital) => {
  if (!token) {
    return {
      badge: 'Blood donation network',
      title: (
        <>
          Connect donors with <span>those who need blood</span>
        </>
      ),
      tagline:
        'BloodDrop links eligible donors with emergency requesters and hospitals — quickly, securely, and when every minute counts.',
      actions: (
        <>
          <Link to="/register" className="home-btn home-btn-primary">
            Join as Donor or Requester
          </Link>
          <Link to="/login" className="home-btn home-btn-secondary">
            Sign In
          </Link>
        </>
      ),
      image: IMAGES.hero,
      imageAlt: 'Healthcare professional preparing blood donation equipment',
    };
  }

  if (role === 'donor') {
    return {
      badge: 'Donor dashboard',
      title: (
        <>
          Your donation <span>saves lives</span>
        </>
      ),
      tagline:
        'Thank you for being part of our community. Update your profile to stay eligible, and check invites when emergencies arise nearby.',
      actions: (
        <>
          <Link to="/profile" className="home-btn home-btn-primary">
            Update Health Profile
          </Link>
          <Link to="/invitations" className="home-btn home-btn-outline">
            View Donation Invites
          </Link>
        </>
      ),
      image: IMAGES.donor,
      imageAlt: 'Blood donation in progress',
    };
  }

  if (role === 'admin') {
    return {
      badge: 'Administrator',
      title: (
        <>
          Platform <span>overview</span>
        </>
      ),
      tagline: 'Review registrations, monitor activity, and keep the BloodDrop network running smoothly.',
      actions: (
        <Link to="/admin" className="home-btn home-btn-primary">
          Open Admin Dashboard
        </Link>
      ),
      image: IMAGES.hospital,
      imageAlt: 'Modern hospital corridor',
    };
  }

  if (isHospital) {
    return {
      badge: 'Hospital partner',
      title: (
        <>
          Manage inventory & <span>emergency requests</span>
        </>
      ),
      tagline:
        'Track blood stock, submit urgent requests, and reach compatible donors across your region from one place.',
      actions: (
        <>
          <Link to="/inventory" className="home-btn home-btn-primary">
            Manage Inventory
          </Link>
          <Link to="/requests" className="home-btn home-btn-outline">
            Request Blood Now
          </Link>
        </>
      ),
      image: IMAGES.hospital,
      imageAlt: 'Hospital building exterior',
    };
  }

  return {
    badge: 'Requester',
    title: (
      <>
        Get help <span>when it matters most</span>
        </>
    ),
    tagline:
      'Submit an emergency blood request and we will instantly notify compatible, nearby donors who can respond.',
    actions: (
      <Link to="/requests" className="home-btn home-btn-primary">
        Request Blood Now
      </Link>
    ),
    image: IMAGES.request,
    imageAlt: 'Medical team coordinating emergency care',
  };
};

const Home = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isHospital = localStorage.getItem('isHospital') === 'true';

  const hero = getHero(token, role, isHospital);
  const welcome = token ? getWelcome(role, isHospital) : null;

  return (
    <div className="home-page animate-fade-in">
      {welcome && (
        <div className="home-welcome">
          <p>{welcome.message}</p>
        </div>
      )}

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">{hero.badge}</span>
          <h1>{hero.title}</h1>
          <p className="home-hero-tagline">{hero.tagline}</p>
          <div className="home-hero-actions">{hero.actions}</div>
        </div>
        <div className="home-hero-image-wrap">
          <img className="home-hero-image" src={hero.image} alt={hero.imageAlt} loading="lazy" />
        </div>
      </section>

      {!token && (
        <>
          <div className="home-stats">
            <div className="home-stat">
              <span className="home-stat-value">8</span>
              <span className="home-stat-label">Blood types supported</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value">24/7</span>
              <span className="home-stat-label">Emergency matching</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value">Fast</span>
              <span className="home-stat-label">Location-based alerts</span>
            </div>
          </div>

          <h2 className="home-section-title">Built for everyone in the chain</h2>
          <p className="home-section-subtitle">Donors, families, and hospitals — one platform to coordinate life-saving blood.</p>
          <div className="home-features">
            {FEATURES_GUEST.map((f) => (
              <article key={f.title} className="home-feature-card">
                <img className="home-feature-img" src={f.img} alt="" loading="lazy" />
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>

          <h2 className="home-section-title">How BloodDrop works</h2>
          <p className="home-section-subtitle">Three simple steps to connect those who can give with those who need help.</p>
          <div className="home-steps">
            {STEPS_GUEST.map((step) => (
              <div key={step.title} className="home-step">
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="home-cta-strip">
            <h3>Ready to make a difference?</h3>
            <p>Join thousands of donors and requesters on BloodDrop today.</p>
            <Link to="/register" className="home-btn">
              Create free account
            </Link>
          </div>
        </>
      )}

    </div>
  );
};

export default Home;
