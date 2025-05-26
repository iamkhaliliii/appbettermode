// Mock data for moderation items
export interface ModerationItem {
  id: string;
  title: string;
  type: 'post' | 'member';
  status: 'pending' | 'reported';
  author: {
    name: string;
    avatar: string;
    email?: string;
  };
  content?: string;
  alerts: string[];
  createdAt: string;
  reportReason?: string;
  space?: {
    name: string;
    color: string;
  };
}

export const MOCK_MODERATION_DATA: ModerationItem[] = [
  {
    id: "1",
    title: "Pass CS0-003 Dumps with DumpsBoss for Top Results",
    type: "post",
    status: "reported",
    author: {
      name: "Amanda Merrifield",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "amanda@example.com"
    },
    content: "Boost Your Confidence. Confidence plays a significant role in exam success. When you feel well-prepared, you approach the exam with a sense of assurance, which can positively impact your performance. By practicing with DumpsBoss dumps, you will be able to identify CS0-003 Exam Dumps areas where you need improvement and work on them before the actual exam. This will allow you to enter the exam room with a higher level of confidence, giving you an edge over other candidates. Time-Efficient Study",
    alerts: ["Akismet", "OOPSpam", "Author Minimum age"],
    createdAt: "1 hour ago",
    reportReason: "Spam content",
    space: {
      name: "General",
      color: "#6366f1"
    }
  },
  {
    id: "2",
    title: "Buy Cheap Essay Writing Services Online - 50% OFF",
    type: "post",
    status: "reported",
    author: {
      name: "EssayHelper2024",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "helper@essayservice.com"
    },
    content: "Get professional essay writing help at affordable prices! Our expert writers deliver high-quality papers on time. Use code SAVE50 for 50% discount on your first order. Contact us now!",
    alerts: ["Akismet", "OOPSpam"],
    createdAt: "2 hours ago",
    reportReason: "Commercial spam",
    space: {
      name: "Study Help",
      color: "#f59e0b"
    }
  },
  {
    id: "3",
    title: "New member registration pending approval",
    type: "member",
    status: "pending",
    author: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "john.smith@example.com"
    },
    alerts: ["Author Minimum age"],
    createdAt: "2 hours ago"
  },
  {
    id: "4",
    title: "Inappropriate behavior in community discussions",
    type: "member",
    status: "reported",
    author: {
      name: "ToxicUser123",
      avatar: "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "toxic@example.com"
    },
    alerts: ["Multiple reports"],
    createdAt: "3 hours ago",
    reportReason: "Harassment and toxic behavior"
  },

  {
    id: "7",
    title: "Suspicious link sharing detected",
    type: "post",
    status: "reported",
    author: {
      name: "LinkSpammer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "spammer@suspicious.com"
    },
    content: "Check out this amazing deal! Click here to get free money: http://suspicious-link.com/free-money-now. Limited time offer, act fast!",
    alerts: ["Akismet", "Suspicious links"],
    createdAt: "5 hours ago",
    reportReason: "Malicious links",
    space: {
      name: "General",
      color: "#6366f1"
    }
  },
  {
    id: "8",
    title: "New member with suspicious email pattern",
    type: "member",
    status: "pending",
    author: {
      name: "User12345678",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "randomuser12345@tempmail.com"
    },
    alerts: ["Suspicious email", "Author Minimum age"],
    createdAt: "6 hours ago"
  },

  {
    id: "11",
    title: "Cryptocurrency investment scam post",
    type: "post",
    status: "reported",
    author: {
      name: "CryptoGuru2024",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "crypto@scammer.com"
    },
    content: "🚀 URGENT: Make $10,000 in 24 hours with this secret crypto strategy! 💰 Join my exclusive Telegram group for insider tips. Only 50 spots available! Send me $100 to secure your spot now! 🔥",
    alerts: ["Akismet", "Financial scam", "Multiple reports"],
    createdAt: "1 day ago",
    reportReason: "Investment scam",
    space: {
      name: "Finance",
      color: "#f59e0b"
    }
  },
  {
    id: "12",
    title: "User posting inappropriate content repeatedly",
    type: "member",
    status: "reported",
    author: {
      name: "InappropriateUser",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "inappropriate@example.com"
    },
    alerts: ["Content violations", "Multiple reports"],
    createdAt: "1 day ago",
    reportReason: "Repeated inappropriate content posting"
  },
  {
    id: "13",
    title: "Help with project setup - beginner question",
    type: "post",
    status: "pending",
    author: {
      name: "NewDeveloper",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "newdev@example.com"
    },
    content: "Hi everyone! I'm new to web development and I'm having trouble setting up my first React project. Can someone help me understand how to configure the development environment? I've tried following the documentation but I'm getting some errors.",
    alerts: ["New user"],
    createdAt: "2 days ago",
    space: {
      name: "Help & Support",
      color: "#10b981"
    }
  },

  {
    id: "15",
    title: "Fake giveaway promotion",
    type: "post",
    status: "reported",
    author: {
      name: "FakeGiveaway",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: "fake@giveaway.com"
    },
    content: "🎉 MEGA GIVEAWAY ALERT! 🎉 We're giving away 100 iPhone 15 Pro Max! To enter: 1) Like this post 2) Share with 10 friends 3) Send your personal info to claim your prize! Hurry, only 24 hours left!",
    alerts: ["Akismet", "Fake giveaway", "Phishing attempt"],
    createdAt: "2 days ago",
    reportReason: "Fake giveaway scam",
    space: {
      name: "General",
      color: "#6366f1"
    }
  }
]; 