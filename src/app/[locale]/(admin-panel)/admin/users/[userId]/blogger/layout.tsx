"use client"

import PageTitle from "@/components/page-title";
import React from "react";
import BloggerNavBar from "./_components/blogger-nav-bar";
import Translate from "@/components/Translate";

type Props = {
  children: React.ReactNode;
  params:
  {
    userId: string
  }
};

const BloggerLayout = (props : Props) => 
{
    return (
        <div className="mb-8 mt-3">
            <div>
                {/* <div className="mb-5">
                    <PageTitle><Translate namespace="Blogger" itemKey="title"/></PageTitle>
                </div> */}

                <BloggerNavBar userId={props.params.userId}/>
            </div>

            <div className="mt-6">{props.children}</div>
        </div>
    );
};

export default BloggerLayout;
