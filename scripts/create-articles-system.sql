-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    sector VARCHAR(100),
    target_audience VARCHAR(50) DEFAULT 'all',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    author VARCHAR(100) DEFAULT 'Fejrul Islam',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create article_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS article_likes (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_sector ON articles(sector);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON article_likes(user_id);

-- Insert sample articles
INSERT INTO articles (title, description, content, sector, target_audience, status, slug, author, views, likes) VALUES
(
    'The Importance of Dawah in Modern Times',
    'Understanding the role and significance of Islamic outreach in contemporary society.',
    'In today''s interconnected world, the importance of dawah (Islamic outreach) cannot be overstated. As Muslims, we are called to share the beautiful message of Islam with wisdom and good counsel.

The Quran reminds us in Surah An-Nahl (16:125): "Call to the way of your Lord with wisdom and good counsel, and argue with them in the best manner."

This verse provides us with the fundamental principles of effective dawah:

1. **Wisdom (Hikmah)**: We must approach dawah with deep understanding and wisdom, knowing when, how, and to whom to convey the message.

2. **Good Instruction (Maw''iza Hasana)**: Our words should be kind, respectful, and delivered with sincere intention to benefit others.

3. **Best Manner of Discussion**: When engaging in dialogue or debate, we should maintain the highest standards of conduct and respect.

In our modern context, dawah takes many forms:
- Personal example and character
- Community service and social work
- Educational initiatives
- Digital outreach through social media
- Interfaith dialogue and cooperation

The key is to embody the values of Islam in our daily lives, making ourselves living examples of the faith we wish to share.

Remember, the goal of dawah is not to win arguments but to plant seeds of truth and understanding. Success is measured not by immediate conversions but by the positive impact we have on hearts and minds.

May Allah guide us all in our efforts to spread His message with wisdom and compassion.',
    'Dawah & Comparative Religion',
    'all',
    'published',
    'importance-of-dawah-modern-times',
    'Dr. Ahmad Hassan',
    245,
    18
),
(
    'Understanding the Five Pillars of Islam',
    'A comprehensive guide to the fundamental practices that form the foundation of Islamic faith.',
    'The Five Pillars of Islam represent the core practices that every Muslim should observe. These pillars form the foundation of a Muslim''s faith and practice, providing structure and meaning to our spiritual journey.

**1. Shahada (Declaration of Faith)**
The Shahada is the first and most fundamental pillar: "La ilaha illa Allah, Muhammad rasul Allah" (There is no god but Allah, and Muhammad is His messenger). This declaration encompasses the entire essence of Islamic belief.

**2. Salah (Prayer)**
Muslims are required to pray five times daily: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). These prayers serve as a direct connection between the worshipper and Allah.

**3. Zakat (Charity)**
Zakat is the obligatory giving of a portion of one''s wealth to those in need. It purifies wealth and helps create a more equitable society. The standard rate is 2.5% of one''s savings annually.

**4. Sawm (Fasting)**
During the month of Ramadan, Muslims fast from dawn to sunset, abstaining from food, drink, and other physical needs. This practice develops self-discipline and empathy for the less fortunate.

**5. Hajj (Pilgrimage)**
Muslims who are physically and financially able must perform the pilgrimage to Mecca at least once in their lifetime. This journey represents the unity of the Muslim ummah and submission to Allah.

These pillars work together to create a balanced spiritual life, combining personal worship, social responsibility, and community engagement. They remind us that Islam is not just a set of beliefs but a complete way of life.

Understanding and practicing these pillars helps Muslims develop a strong relationship with Allah while contributing positively to society.',
    'Qirat & Ilm',
    'all',
    'published',
    'understanding-five-pillars-islam',
    'Imam Abdullah Rahman',
    189,
    24
),
(
    'The Art of Islamic Calligraphy: Beauty in Sacred Text',
    'Exploring the spiritual and artistic dimensions of Islamic calligraphy as a form of worship and cultural expression.',
    'Islamic calligraphy stands as one of the most revered art forms in the Muslim world, transforming the sacred words of the Quran and Islamic teachings into visual masterpieces that inspire both the eye and the soul.

**Historical Development**
The art of Islamic calligraphy emerged in the early centuries of Islam, developing from the need to preserve and beautify the Quranic text. What began as a practical necessity evolved into a sophisticated art form that reflects the divine nature of the words being written.

**Spiritual Significance**
For Muslim calligraphers, their work is more than artistic expression—it is an act of worship. The careful formation of each letter, the meditative process of writing sacred texts, and the intention to glorify Allah through beauty all contribute to the spiritual dimension of this art.

**Major Calligraphic Styles**
Several distinct styles have emerged over the centuries:

- **Kufic**: The earliest style, characterized by angular, geometric forms
- **Naskh**: A cursive style that became the standard for copying the Quran
- **Thuluth**: An elegant script often used for architectural inscriptions
- **Nastaliq**: A flowing style popular in Persian and Urdu calligraphy
- **Diwani**: An ornate Ottoman style used for official documents

**Contemporary Relevance**
Today, Islamic calligraphy continues to thrive, with artists exploring new mediums and techniques while maintaining respect for traditional forms. Digital tools have opened new possibilities for calligraphic expression, allowing artists to reach global audiences.

**Learning the Art**
For those interested in learning Islamic calligraphy:
1. Start with basic letter forms and proportions
2. Practice regularly with traditional tools (reed pen and ink)
3. Study classical examples and seek guidance from experienced calligraphers
4. Approach the practice with reverence and spiritual intention

Islamic calligraphy reminds us that beauty and spirituality are not separate realms but can be unified in the service of the divine. Through this art form, we see how human creativity can be channeled to glorify Allah and inspire others on their spiritual journey.',
    'Literature & History',
    'all',
    'published',
    'art-islamic-calligraphy-beauty-sacred-text',
    'Ustadha Fatima Al-Zahra',
    156,
    31
),
(
    'Building Strong Islamic Character: The Path of Tarbiya',
    'A guide to spiritual development and character building through Islamic principles and practices.',
    'Tarbiya, the Islamic concept of spiritual and moral development, represents one of the most important aspects of a Muslim''s journey toward spiritual excellence. It encompasses the comprehensive development of an individual''s character, behavior, and relationship with Allah.

**Understanding Tarbiya**
The word "tarbiya" comes from the Arabic root r-b-b, which relates to nurturing, developing, and bringing something to its full potential. In Islamic context, it refers to the process of spiritual and moral cultivation that transforms a person''s character according to Islamic values.

**The Prophetic Model**
The Prophet Muhammad (peace be upon him) serves as the perfect example of Islamic character. The Quran describes him as having "an exalted standard of character" (68:4). His life provides us with practical examples of how to implement Islamic values in daily life.

**Key Elements of Character Development**

**1. Self-Awareness (Muraqaba)**
Regular self-reflection and accountability before Allah. This involves:
- Daily examination of one''s actions and intentions
- Seeking forgiveness for shortcomings
- Continuous effort to improve

**2. Patience (Sabr)**
Developing resilience and perseverance in the face of challenges:
- Patience in worship and obedience to Allah
- Patience in avoiding sins and temptations
- Patience during trials and difficulties

**3. Gratitude (Shukr)**
Recognizing and appreciating Allah''s blessings:
- Expressing gratitude through words and actions
- Using blessings in ways that please Allah
- Helping others as a form of gratitude

**4. Humility (Tawadu)**
Maintaining modesty and avoiding arrogance:
- Recognizing our dependence on Allah
- Treating others with respect regardless of their status
- Continuously seeking knowledge and improvement

**Practical Steps for Character Development**
1. **Regular Prayer and Dhikr**: Maintaining connection with Allah
2. **Quranic Study**: Learning from divine guidance
3. **Following Prophetic Example**: Implementing Sunnah in daily life
4. **Seeking Knowledge**: Continuous learning and growth
5. **Community Engagement**: Learning from and serving others

**The Role of Community**
Tarbiya is not a solitary journey. The Muslim community plays a crucial role in supporting individual development through:
- Mutual advice and encouragement
- Collective worship and learning
- Accountability and support systems

Character development in Islam is a lifelong journey that requires patience, consistency, and sincere intention. Through tarbiya, we strive to become the best versions of ourselves, serving Allah and benefiting humanity.',
    'Tarbiya & Idad',
    'all',
    'published',
    'building-strong-islamic-character-path-tarbiya',
    'Sheikh Omar Al-Mansouri',
    203,
    27
),
(
    'The Significance of Ziyara: Visiting Sacred Places',
    'Understanding the spiritual and educational value of visiting Islamic historical sites and holy places.',
    'Ziyara, the practice of visiting sacred places and historical Islamic sites, holds deep spiritual significance in Islamic tradition. It serves as a means of spiritual reflection, historical education, and strengthening one''s connection to Islamic heritage.

**Types of Ziyara**

**1. Ziyara of the Prophet''s Mosque (Masjid an-Nabawi)**
Visiting the Prophet''s mosque in Medina is highly recommended and often combined with Hajj or Umrah. This visit allows Muslims to:
- Pray in the mosque where the Prophet worshipped
- Reflect on the early Islamic community
- Send greetings upon the Prophet at his resting place

**2. Ziyara of Righteous People**
Visiting the graves of scholars, saints, and righteous individuals for:
- Remembrance of death and the afterlife
- Learning from their examples
- Making du''a and seeking Allah''s mercy

**3. Historical Islamic Sites**
Visiting places of Islamic historical significance:
- Battlefields where early Muslims struggled
- Mosques with historical importance
- Centers of Islamic learning and scholarship

**Spiritual Benefits**
Ziyara offers numerous spiritual advantages:

**Remembrance of Death**: Visiting graves reminds us of our mortality and the temporary nature of this world, encouraging us to focus on the afterlife.

**Historical Connection**: Walking in the footsteps of our predecessors helps us feel connected to Islamic history and tradition.

**Spiritual Reflection**: Sacred places provide an environment conducive to contemplation and spiritual growth.

**Increased Devotion**: Experiencing the places where great Muslims lived and worshipped can inspire greater devotion and commitment.

**Proper Etiquette for Ziyara**
When visiting sacred places, Muslims should observe proper etiquette:

1. **Purify Intention**: Visit for the sake of Allah and spiritual benefit
2. **Maintain Respect**: Behave with dignity and reverence
3. **Make Du''a**: Use the opportunity for sincere supplication
4. **Avoid Innovations**: Stay within the bounds of Islamic teachings
5. **Learn and Reflect**: Take time to understand the historical significance

**Educational Value**
Ziyara serves as a powerful educational tool:
- Brings Islamic history to life
- Provides context for Quranic verses and Hadith
- Inspires commitment to Islamic values
- Strengthens cultural and religious identity

**Contemporary Considerations**
In our modern world, ziyara can include:
- Virtual tours of sacred sites for those unable to travel
- Local visits to Islamic centers and historical mosques
- Educational programs about Islamic heritage
- Community trips to significant Islamic sites

**Balancing Respect and Worship**
It''s important to remember that while ziyara is beneficial, our worship is directed only to Allah. Sacred places are means of remembrance and reflection, not objects of worship themselves.

Through thoughtful and respectful ziyara, Muslims can deepen their understanding of Islamic history, strengthen their faith, and feel more connected to the global Muslim community. These visits serve as reminders of our rich heritage and inspire us to continue the legacy of those who came before us.',
    'Ziyara',
    'all',
    'published',
    'significance-ziyara-visiting-sacred-places',
    'Dr. Aisha Mahmoud',
    178,
    22
) ON CONFLICT (slug) DO NOTHING;

-- Update the admin content management to include articles
-- This will be handled in the application code

COMMIT;