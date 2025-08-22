import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ServiceRequests from "./pages/ServiceRequests";
import CmsManagement from "./pages/CmsManagement";
import Faq from "./pages/Faq";
import AccountSettings from "./pages/AccountSettings";
import PushNotification from "./pages/PushNotification";
import AddServiceRequest from "./components/AddServiceRequest";
import AddProgram from "./components/AddProgram";
import AddUser from "./components/AddUser";
import Providers from "./pages/Providers";
import Orders from "./pages/Orders";
import Revenue from "./pages/Revenue";
import Club from "./pages/Club";
import GolfCourses from "./pages/GolfCourses";
import Lessions from "./pages/Lessions";
import AddLesson from "./additionalPages/AddLession";
import AddMakeable from "./additionalPages/practice/AddMakeable";
import UploadChippingDrillFairway from "./additionalPages/practice/UploadChippingDrillFairway";
import ChippingDrillRough from "./additionalPages/practice/ChippingDrillRough";
import Survivor from "./additionalPages/practice/Survivor";
import DriverTest from "./additionalPages/practice/DriverTest";
import Approach from "./additionalPages/practice/Approach";
import ApproachVariable from "./additionalPages/practice/ApproachVariable";
import LagPutt from "./additionalPages/practice/LagPutt";
import StrokeTest from "./additionalPages/practice/StrokeTest";
import SimulatedRound from "./additionalPages/practice/SimulatedRound";
import AddClub from "./additionalPages/AddClub";
import AddCourse from "./additionalPages/AddCourses";
import HoleSetup from "./additionalPages/HoleSetup";
import ViewCourseDetails from "./additionalPages/ViewCourseDetails";
import EditCourse from "./additionalPages/EditCourse";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/clubs" element={<Club />} />
          <Route path="/golf-courses" element={<GolfCourses />} />
          <Route path="/lessions" element={<Lessions />} />
          <Route path="/lessions/add-lessions" element={<AddLesson />} />
          <Route path="/clubs/add-clubs" element={<AddClub />} />
          <Route path="/courses/add-courses" element={<AddCourse />} />
          <Route path="/courses/hole-setup" element={<HoleSetup />} />
          <Route path="/courses/view-details" element={<ViewCourseDetails />} />
          <Route path="/courses/edit-course" element={<EditCourse />} />

          <Route path="/practice/lag-putt" element={<LagPutt />} />
          <Route path="/practice/stroke-test" element={<StrokeTest />} />
          <Route path="/practice/simulated-round" element={<SimulatedRound />} />
          <Route path="/practice/add-makeable" element={<AddMakeable />} />
          <Route path="/practice/fairway" element={<UploadChippingDrillFairway />} />
          <Route path="/practice/rough" element={<ChippingDrillRough />} />
          <Route path="/practice/survivor" element={<Survivor />} />
          <Route path="/practice/driver-test" element={<DriverTest />} />
          <Route path="/practice/approach" element={<Approach />} />
          <Route path="/practice/approach-variable" element={<ApproachVariable />} />

          <Route path="/users/edit-user" element={<AddUser />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/add-providers" element={<AddProgram />} />
          <Route path="/service-requests" element={<ServiceRequests />} />
          <Route path="/service-requests/add-request" element={<AddServiceRequest />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/cms-manage" element={<CmsManagement />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/notification" element={<PushNotification />} />
          <Route />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
