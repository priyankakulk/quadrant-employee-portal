import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

export default function JobListings() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: "Senior Software Developer",
      postedTime: "2 days ago",
      qualifications: ["3 years of experience"],
      starred: false,
      description: "We are seeking a highly skilled Senior Software Developer to join our dynamic team. You will be responsible for designing, developing, and maintaining complex software applications using modern technologies and best practices.",
      responsibilities: [
        "Lead software development projects from conception to deployment",
        "Mentor junior developers and conduct code reviews",
        "Collaborate with cross-functional teams to define technical requirements",
        "Optimize application performance and ensure scalability"
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of experience in software development",
        "Proficiency in React, Node.js, and modern web technologies",
        "Strong problem-solving and communication skills"
      ],
      salary: "$80,000 - $120,000",
      location: "Remote / Seattle, WA"
    },
    {
      id: 2,
      title: "IT Manager",
      postedTime: "3 months ago",
      qualifications: ["IT experience"],
      starred: true,
      description: "Join our team as an IT Manager to oversee our technology infrastructure and lead a team of IT professionals. You will be responsible for strategic planning, system administration, and ensuring optimal IT operations.",
      responsibilities: [
        "Manage and lead the IT department team",
        "Develop and implement IT policies and procedures",
        "Oversee network security and data protection initiatives",
        "Budget planning and vendor management for IT resources"
      ],
      requirements: [
        "Bachelor's degree in Information Technology or related field",
        "5+ years of IT experience with 2+ years in management",
        "Strong knowledge of network administration and cybersecurity",
        "Leadership and project management skills"
      ],
      salary: "$90,000 - $130,000",
      location: "Seattle, WA"
    },
    {
      id: 3,
      title: "Product Manager",
      postedTime: "1 week ago",
      qualifications: ["2 years of experience"],
      starred: true,
      description: "We're looking for a strategic Product Manager to drive product development and work closely with engineering, design, and marketing teams to deliver exceptional user experiences.",
      responsibilities: [
        "Define product roadmap and strategy",
        "Gather and prioritize product requirements",
        "Work with engineering teams to deliver features on time",
        "Analyze market trends and competitor products"
      ],
      requirements: [
        "Bachelor's degree in Business, Engineering, or related field",
        "2+ years of experience in product management",
        "Strong analytical and problem-solving skills",
        "Experience with Agile development methodologies"
      ],
      salary: "$75,000 - $110,000",
      location: "Hybrid - Seattle, WA"
    },
    {
      id: 4,
      title: "Manager",
      postedTime: "1 month ago",
      qualifications: ["Azure Certification"],
      starred: false,
      description: "We are seeking an experienced Manager to lead our cloud infrastructure team. This role focuses on Azure cloud services and requires strong leadership skills to guide technical teams.",
      responsibilities: [
        "Lead cloud infrastructure and DevOps initiatives",
        "Manage team of cloud engineers and architects",
        "Implement best practices for cloud security and compliance",
        "Drive digital transformation projects"
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "Azure certification (AZ-104 or higher preferred)",
        "3+ years of management experience in cloud environments",
        "Strong understanding of DevOps practices and tools"
      ],
      salary: "$95,000 - $140,000",
      location: "Seattle, WA"
    }
  ];

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg shadow-sm border p-6 relative cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => setSelectedJob(job)}
            >
              {/* Star Icon */}
              {job.starred && (
                <div className="absolute top-4 right-4">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              )}
              
              {/* Job Title */}
              <h2 className="text-xl font-semibold text-gray-900 mb-3 pr-8">
                {job.title}
              </h2>
              
              {/* Job Posted Time */}
              <p className="text-gray-600 text-sm mb-1">
                Job Posted: {job.postedTime}
              </p>
              
              {/* Qualifications */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Qualifications:</p>
                <ul className="list-none space-y-1">
                  {job.qualifications.map((qualification, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {qualification}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Apply Button */}
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors duration-200 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle apply action here
                }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900 mr-3">
                  {selectedJob.title}
                </h2>
                {selectedJob.starred && (
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Posted:</span>
                  <span className="ml-2 text-gray-600">{selectedJob.postedTime}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{selectedJob.location}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Salary:</span>
                  <span className="ml-2 text-gray-600">{selectedJob.salary}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium">
                  Apply Now
                </button>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}