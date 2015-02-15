import React from 'react';
import {CommentBox, CommentList, CommentForm} from './components.jsx';


React.render(
  <CommentBox url="comments.json" />,
  document.getElementById('content')
);
