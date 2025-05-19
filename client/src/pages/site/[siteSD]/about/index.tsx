import React from 'react';
import { useParams } from 'wouter';
import { SiteLayout } from '@/components/layout/site/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Heart, Globe, Mail, Twitter, Github, Linkedin } from 'lucide-react';
import { sitesApi } from '@/lib/api';
import { useEffect, useState } from 'react';

const TEAM_MEMBERS = [
  {
    name: "Jane Smith",
    role: "Founder & CEO",
    bio: "Jane founded our community in 2023 with a vision to connect music lovers around the world.",
    avatar: "https://i.pravatar.cc/150?img=1",
    social: {
      twitter: "https://twitter.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith"
    }
  },
  {
    name: "Alex Johnson",
    role: "Community Manager",
    bio: "Alex has been passionate about music for over 15 years and loves helping our community thrive.",
    avatar: "https://i.pravatar.cc/150?img=2",
    social: {
      twitter: "https://twitter.com/alexj",
      linkedin: "https://linkedin.com/in/alexj",
    }
  },
  {
    name: "Sam Wilson",
    role: "Lead Developer",
    bio: "Sam is a full-stack developer with expertise in creating seamless digital experiences.",
    avatar: "https://i.pravatar.cc/150?img=3",
    social: {
      github: "https://github.com/samwilson",
      linkedin: "https://linkedin.com/in/samwilson",
    }
  },
  {
    name: "Maria Garcia",
    role: "Content Curator",
    bio: "Maria brings her extensive knowledge of music genres to curate exceptional recommendations.",
    avatar: "https://i.pravatar.cc/150?img=4",
    social: {
      twitter: "https://twitter.com/mariagarcia",
    }
  }
];

const VALUES = [
  {
    title: "Community First",
    description: "We believe that a strong community creates better experiences for everyone. Our platform is built with community needs at its core.",
    icon: <Users className="h-8 w-8 text-indigo-500" />
  },
  {
    title: "Passionate About Music",
    description: "Our shared love for music drives everything we do. We're committed to enhancing how people discover, share, and enjoy music.",
    icon: <Heart className="h-8 w-8 text-rose-500" />
  },
  {
    title: "Global Perspective",
    description: "Music transcends borders. We celebrate diversity and strive to connect music lovers from all cultures and backgrounds.",
    icon: <Globe className="h-8 w-8 text-emerald-500" />
  }
];

export default function AboutPage() {
  const { siteSD } = useParams();
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  if (!siteSD) return <div>Site identifier is missing</div>;

  return (
    <SiteLayout siteSD={siteSD}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About {site?.name || 'Our Community'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Learn more about our mission, values, and the team behind the community.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 pb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {site?.name || 'Our community'} was founded in 2023 with a simple mission: to create a space where music enthusiasts could connect, share, and discover together. What began as a small forum for like-minded individuals has grown into a vibrant community spanning the globe.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our platform was born out of a shared frustration with existing music communities that were either too fragmented or too focused on promotion rather than genuine connection. We wanted to build something different—a place where the love of music comes first, and where members feel valued and heard.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Today, we continue to evolve based on feedback from our community. Every feature we develop, every improvement we make, is guided by our commitment to enhancing how people experience music together.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader>
                  <div className="mb-3">{value.icon}</div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader className="items-center text-center pt-8">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center space-x-3">
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Contact Us</h2>
          <div className="max-w-xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                  Have questions or feedback? We'd love to hear from you! Reach out to us using any of the methods below.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a href="mailto:contact@example.com" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500">
                    <Mail className="h-5 w-5" />
                    <span>contact@example.com</span>
                  </a>
                  <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500">
                    <Twitter className="h-5 w-5" />
                    <span>@example</span>
                  </a>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button>
                  Send a Message
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
} 