import React, { useState } from 'react';
import { Button, Textarea } from "flowbite-react";
import PostCreationMultiSelect from '@/components/PostCreationMultiSelect';


const Admin: React.FC = () => {
    const [isPostCreating, setPostCreating] = useState(false);
    const handleCreatePost = ()=> {
        setPostCreating(true);
    }
    return (
        <>
            <div className='relative bg-white bg-opacity-75 mt-16 p-6'>
                <div className='relative flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <h2 className="text-4xl font-extrabold text-gray-900">Create Post</h2>
                    <PostCreationMultiSelect />
                </div>
                <p className="my-4 text-lg text-gray-500">
                    Choose where you want to create your post. Select Blog, LinkedIn, or both from the dropdown menu above.
                </p>
                {!isPostCreating &&  <div className='relative flex'><h3 className='text-3xl'>Create post from</h3>
                <div className='ml-4'>
                <Button.Group outline>
                        <Button color="gray" className='from_text' onClick={handleCreatePost}>Raw Text</Button>
                        <Button color="gray">pdf/docx</Button>
                        <Button color="gray">Text file</Button>
                    </Button.Group>
                </div>
                </div>}
                {isPostCreating && <div className=''>
                    <h2 className="text-4xl font-bold dark:text-white">Place your Raw Content </h2>
                    <Textarea id="blog" placeholder="Paste raw content here" rows={10} />
                    <div className='flex space-x-2 mt-4'>                        
                    <Button color="red">Create Post</Button>
                    <Button color="red" onClick={()=> {setPostCreating(false)}}>Cancel</Button></div>
                </div>

                }
            </div>
        </>
    );
};

export default Admin;