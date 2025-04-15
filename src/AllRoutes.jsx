import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './page/Home/Home';
import Questions from './page/Questions/Questions.jsx';
import AskQuestions from './page/AskQuestion/AskQuestion.jsx';
import DisplayQuestions from './page/Questions/DisplayQuestions';
import TagList from './page/Tags/TagList';
import UsersList from './page/Users/UsersList.jsx';
import Auth from './page/Auth/Auth';
import UserProfile from './page/UserProfile/UserProfile.jsx';
import EditProfileForm from './page/UserProfile/EditProfileForm';
import SearchResult from './page/SearchResult/SearchResult';
import EditQuestion from './page/Questions/EditQuestion';
import TagQuestions from './page/Tags/TagQuestions.jsx';
import withTitle from './components/Title/withTitle';

const AllRoutes = () => {
  // Wrap components with withTitle to assign appropriate titles
  const HomeWithTitle = withTitle(Home, "Home");
  const QuestionsWithTitle = withTitle(Questions, "Questions");
  const AskQuestionsWithTitle = withTitle(AskQuestions, "Ask a Question");
  const DisplayQuestionsWithTitle = withTitle(DisplayQuestions, "Question Details");
  const EditQuestionWithTitle = withTitle(EditQuestion, "Edit Question");
  const TagListWithTitle = withTitle(TagList, "Tags");
  const TagQuestionsWithTitle = withTitle(TagQuestions, "Tag Questions");
  const UsersListWithTitle = withTitle(UsersList, "Users");
  const UserProfileWithTitle = withTitle(UserProfile, "User Profile");
  const EditProfileFormWithTitle = withTitle(EditProfileForm, "Edit Profile");
  const SearchResultWithTitle = withTitle(SearchResult, "Search Results");
  const AuthWithTitle = withTitle(Auth, "Login / Signup");

  return (
    <Routes>
      <Route exact path="/" element={<HomeWithTitle />} />
      <Route exact path="/Auth" element={<AuthWithTitle />} />
      <Route exact path="/Questions" element={<QuestionsWithTitle />} />
      <Route exact path="/AskQuestion" element={<AskQuestionsWithTitle />} />
      <Route exact path="/Questions/:id" element={<DisplayQuestionsWithTitle />} />
      <Route exact path="/Questions/:id/edit" element={<EditQuestionWithTitle />} />
      <Route path="/Tags" element={<TagListWithTitle />} />
      <Route path="/TagQuestions/:tagName/:tagId" element={<TagQuestionsWithTitle />} />
      <Route path="/Users" element={<UsersListWithTitle />} />
      <Route path="/Users/:id" element={<UserProfileWithTitle />} />
      <Route path="/UserProfile/:id" element={<UserProfileWithTitle />} />
      <Route path="/EditProfile/:id" element={<EditProfileFormWithTitle />} />
      <Route path="/Search" element={<SearchResultWithTitle />} />
    </Routes>
  );
};

export default AllRoutes;
