import React from 'react';
import DOMPurify from 'dompurify';
import { Typography } from '@material-ui/core';

export default function SubmissionBody(props) {
  if (!props.text) return (<></>);
  const clean = DOMPurify.sanitize(props.text);
  return <Typography variant="body2" dangerouslySetInnerHTML={{ __html: clean }} />;
}
