import { registerRootComponent } from "expo";

import App from "./App";
// import SignUp from "./Signup";
//  import SignIn from './Signin';
// import Home from './Home';
//  import AddHabit from './AddHabit';
// import HabitDetailsScreen from "./HabitDetails";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
