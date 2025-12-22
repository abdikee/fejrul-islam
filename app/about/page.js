'use client';

import Image from 'next/image';
import { Users, BookOpen, Heart, Target, Award, Globe } from 'lucide-react';
import ManagedPageSection from '@/components/site/ManagedPageSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              About <span className="text-emerald-600">HUMSJ</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Haramaya University Muslim Students' Jama'a - Fostering Islamic education, 
              character development, and academic excellence since our establishment.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To provide comprehensive Islamic education through our four core sectors: 
                Qirat & Ilm, Literature, Tarbiya & Idad, and Dawah. We strive to develop 
                well-rounded Muslim students who excel academically while maintaining 
                strong Islamic values and character.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To be a leading Islamic educational organization that produces 
                knowledgeable, righteous, and socially responsible Muslim graduates 
                who contribute positively to society while upholding the principles 
                of Islam in all aspects of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do at HUMSJ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Knowledge (Ilm)</h3>
              <p className="text-slate-600">
                Pursuing Islamic and academic knowledge as a fundamental duty and pathway to success.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Character (Akhlaq)</h3>
              <p className="text-slate-600">
                Developing excellent character based on the teachings of the Quran and Sunnah.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Community (Ummah)</h3>
              <p className="text-slate-600">
                Building strong bonds of brotherhood and sisterhood within the Muslim community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Sectors */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Our Educational Sectors
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Four comprehensive programs designed to nurture complete Islamic education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Qirat & Ilm</h3>
              <p className="text-sm text-slate-600">
                Quran recitation, Islamic sciences, and religious knowledge development.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Literature</h3>
              <p className="text-sm text-slate-600">
                Islamic literature, poetry, and cultural heritage preservation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Tarbiya & Idad</h3>
              <p className="text-sm text-slate-600">
                Character development, leadership training, and spiritual growth.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Dawah</h3>
              <p className="text-sm text-slate-600">
                Comparative religion studies and Islamic outreach activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Achievements */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Our Journey
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Establishment</h3>
                    <p className="text-slate-600">
                      Founded as a student organization dedicated to Islamic education and character development.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Growth & Development</h3>
                    <p className="text-slate-600">
                      Expanded our programs to include comprehensive Islamic education across four key sectors.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Digital Innovation</h3>
                    <p className="text-slate-600">
                      Launched our digital platform to enhance learning experiences and community engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-sm text-slate-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                  <div className="text-sm text-slate-600">Mentors & Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">100+</div>
                  <div className="text-sm text-slate-600">Courses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">10+</div>
                  <div className="text-sm text-slate-600">Years of Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Join Us */}
      <section className="py-16 px-6 bg-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Become part of a vibrant Islamic educational community dedicated to 
            knowledge, character, and service to Allah and humanity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth/signup"
              className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Join HUMSJ Today
            </a>
            <a 
              href="/auth/login"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Member Login
            </a>
          </div>
        </div>
      </section>

      <ManagedPageSection slug="about" />
    </div>
  );
}