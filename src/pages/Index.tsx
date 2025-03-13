
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckSquare, BarChart2, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-journal-blue to-journal-purple py-20 text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Daily Productivity Journal
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-md">
                Track your productivity, journal your thoughts, and gain insights to improve your daily habits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-journal-blue hover:bg-white/90"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-journal-green/20 rounded-xl"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg relative">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-journal-blue mr-2" />
                    <h3 className="font-medium text-gray-800">Today's Journal</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Had a productive morning meeting. Planning to work on the new project proposal this afternoon.</p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <span className="bg-journal-blue/10 text-journal-blue text-xs px-2 py-1 rounded-full">Meeting</span>
                      <span className="bg-journal-green/10 text-journal-green text-xs px-2 py-1 rounded-full">Project</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Journal Entries",
                description: "Capture your thoughts, ideas, and reflections with rich text formatting.",
                icon: <BookOpen className="h-10 w-10 text-journal-blue" />,
              },
              {
                title: "Task Management",
                description: "Organize and prioritize your tasks with due dates and reminders.",
                icon: <CheckSquare className="h-10 w-10 text-journal-green" />,
              },
              {
                title: "Habit Tracking",
                description: "Build consistent habits and visualize your progress over time.",
                icon: <BarChart2 className="h-10 w-10 text-journal-purple" />,
              },
              {
                title: "AI Insights",
                description: "Get personalized recommendations based on your productivity patterns.",
                icon: <Calendar className="h-10 w-10 text-journal-pink" />,
              },
              {
                title: "Mood Analysis",
                description: "Track your mood and discover correlations with your activities.",
                icon: <CheckSquare className="h-10 w-10 text-journal-blue" />,
              },
              {
                title: "Progress Reports",
                description: "Visualize your productivity journey with detailed charts and analytics.",
                icon: <BarChart2 className="h-10 w-10 text-journal-green" />,
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-journal-blue text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start journaling, tracking tasks, and building better habits today.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-journal-blue hover:bg-white/90"
            onClick={() => navigate("/dashboard")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-journal-blue mr-2" />
              <span className="text-white font-bold">ProductiveJournal</span>
            </div>
            <div>
              <p>© 2023 ProductiveJournal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
