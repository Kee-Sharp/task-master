# Improvements
Below are a list of improvements that could be made to the current application as of 12/25/25. It is not an exhaustive list, just one to get started.

## Visual
- Choose a different background color
- Support dark mode
- Add more considerations to the layout for mobile

## Task List
- Show description (plus other details) in popup when double clicked
- Checking off task marks all subtasks as completed
  - Show popup to optionally confirm this behavior
- Mark main task as completed if all subtasks are completed
  - Show popup to confirm
- Show task status as indeterminate if some but not all subtasks are completed
- Add duplicate task action

## Task Timeline
- Make selecting the task on the timeline highlight the task in the list or open the popup with the details
- Figure out how to make the text overflow go to ellipsis when the box is too narrow
- See if theres a way to group tasks and subtasks
- Edit tasks from timeline (set item property `editable` to true)

## General
- Change id from epoch time to uuid v4
- Add searching/filtering to tasks
- Import tasks from json file (react-dropzone)
