// // components/contactForm.tsx
"use client"

import React, { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactForm() {
    const [formData, setFormData]= useState({
        name:"",
        email:"",
        message:""
    });
    const [error,setError]= useState("");
    const [success, setSuccess]= useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,[e.target.name]: e.target.value})
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if(!formData.name || !formData.email || !formData.message){
            setError("All fields are required.");
            return;
        }

        try{
            const res = await fetch(`${API_BASE_URL}/api/contact`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if(!res.ok){
                setError(data.message || "Failed to submit form.");
                return;
            }

            setSuccess("Form submitted successfully!");
            setFormData({name:"",email:"",message:""});
        }catch(err){
            console.error("Error submitting form:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 text-gray-700 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 text-gray-700 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 text-gray-700 p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Write your message here..."
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        Send Message
      </button>
    </form>
    )
}


// import React from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { sendFormData } from '../servives/services';

// const ContactForm: React.FC = () => {
//     const formik = useFormik({
//         initialValues: {
//             name: '',
//             email: '',
//             message: ''
//         },
//         validationSchema: Yup.object({
//             name: Yup.string().required('Name is required'),
//             email: Yup.string().email('Invalid email').required('Email is required'),
//             message: Yup.string().required('Message is required')
//         }),
//         onSubmit: async (values) => {
//             try {
//                 await sendFormData(values);
//                 alert('Form submitted successfully!');
//             } catch (error) {
//                 alert('Error submitting form. Please try again.');
//             }
//         }
//     });

//     return (
//         <form onSubmit={formik.handleSubit}>
//             <div>
//                 <label htmlFor="name">Name</label>
//                 <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.name}
//                 />
//                 {formik.touched.name && formik.errors.name ? (
//                     <div>{formik.errors.name}</div>
//                 ) : null}
//             </div>

//             <div>
//                 <label htmlFor="email">Email</label>
//                 <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.email}
//                 />
//                 {formik.touched.email && formik.errors.email ? (
//                     <div>{formik.errors.email}</div>
//                 ) : null}
//             </div>

//             <div>
//                 <label htmlFor="message">Message</label>
//                 <textarea
//                     id="message"
//                     name="message"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.message}
//                 />
//                 {formik.touched.message && formik.errors.message ? (
//                     <div>{formik.errors.message}</div>
//                 ) : null}
//             </div>
//             <button type="submit">Send</button>
//         </form>
//     );
// }
