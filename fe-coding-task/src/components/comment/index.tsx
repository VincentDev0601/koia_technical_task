import { TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

import './styles.css';

type CommentProps = {
  comment: string;
  saveComment: (comment: string) => void;
};

export function Comment({ comment, saveComment }: CommentProps) {
  const [editMode, setEditMode] = useState(!!comment);
  return (
    <div className="comment-wrapper">
      {!editMode ? (
        <div>
          <div className="comment-input-wrapper">
            <TextField
              multiline
              value={comment}
              onChange={(e) => saveComment(e.target.value)}
            />
          </div>
          <Button
            variant="contained"
            onClick={() => {
              setEditMode(!editMode);
            }}
          >
            Save
          </Button>
        </div>
      ) : (
        <div>
          <Box component="p" sx={{ p: 2, border: '1px dashed grey' }}>
            {comment}
          </Box>
          <Button variant="contained" onClick={() => setEditMode(!editMode)}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
