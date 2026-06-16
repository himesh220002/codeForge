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
        <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-950/50 border border-gray-800 text-white p-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all placeholder:text-gray-600 shadow-inner"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-950/50 border border-gray-800 text-white p-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all placeholder:text-gray-600 shadow-inner"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-950/50 border border-gray-800 text-white p-3.5 h-32 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all placeholder:text-gray-600 shadow-inner resize-y"
          placeholder="Write your message here..."
        />
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</p>}
      {success && <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">{success}</p>}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-0.5"
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
