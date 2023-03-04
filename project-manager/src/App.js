import * as React from 'react';
import lightTheme from './theme/light-theme';
import darkTheme from './theme/dark-theme';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './containers/Login';
import Projects from './containers/Projects';
import ProjectDashboard from './containers/ProjectDashboard';

import Layout from './containers/Layout';
import Box from '@mui/material/Box';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.log(error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI here
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const App = () => {
  // handle dark mode
  const [mode, setMode] = React.useState(true);
  const appliedTheme = createTheme(mode ? lightTheme : darkTheme);

  const toggleTheme = () => {
    setMode(!mode);
  };

  // handle projects
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch('http://127.0.0.1:9393/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data));
  };
  console.log(projects);

  const patchProjects = (project) => {
    fetch(`http://localhost:9393/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        favorite: project.favorite,
        title: project.title,
        color: project.color,
      }),
    });
  };

  const postProjects = (project) => {
    fetch('http://127.0.0.1:9393/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects((prevProjects) => {
          return [...prevProjects, data];
        });
      });
  };

  const handleDeleteProject = (deleteProject) => {
    const updatedProjects = projects.filter(
      (project) => project.id !== deleteProject.id
    );

    fetch(`http://127.0.0.1:9393/projects/${deleteProject.id}`, {
      method: 'DELETE',
    });

    setProjects(updatedProjects);
  };

  const handleUpdatingProject = (changedProject) => {
    patchProjects(changedProject);

    const updatedProjects = projects.map((project) =>
      project.id === changedProject.id ? changedProject : project
    );
    setProjects(updatedProjects);
  };

  // handle search
  const [search, setSearch] = React.useState('');

  return (
    <ThemeProvider theme={appliedTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Router>
          <Layout
            toggleTheme={toggleTheme}
            mode={mode}
            projects={projects}
            search={
search}
            setSearch={setSearch}
            fetchProjects={fetchProjects}
          >
            <Route exact path="/home">
              <Login />
            </Route>
            <Route exact path="/projects">
              <Projects
                mode={mode}
                patchProjects={patchProjects}
                postProjects={postProjects}
                handleUpdatingProject={handleUpdatingProject}
                handleDeleteProject={handleDeleteProject}
              />
            </Route>
            <Route exact
              path='/projects/:id'
              render={(routerProps) => (
                <ProjectDashboard
                  {...routerProps}
                  mode={mode}
                  handleUpdatingProject={handleUpdatingProject}
                  handleDeleteProject={handleDeleteProject}
                />
              )}
            />
          </Layout>
        </Router>
      </Box>
    </ThemeProvider>
  );

}
export default App
