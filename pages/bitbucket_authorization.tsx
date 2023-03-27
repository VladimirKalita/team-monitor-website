import Link from "next/link";
import Button from "../components/Button";

export default function Auth() {

  const handleAuthorize = () => {
    // Construct the URL to the Bitbucket authorization page
    const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
    const redirectUri = 'https://gcscruncsql-k7jns52mtq-el.a.run.app/authorise_bitbucket_consumer'; // Change this to the orginal redirecturi
    const scopes = 'repository';
    const clientId = process.env.NEXT_PUBLIC_BITBUCKET_OAUTH_CLIENT_ID;

    const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;

    window.location.href = url;
  };
  return (
    <div className='p-5'>
      <h1 className="font-bold text-3xl">Setup Instructions - Github</h1>
      <ol className="list-decimal">
        <li>Log in/Sign up with Vibinex chrome-extension</li>
        <li>Install <Link href = "https://github.com/apps/repoprofiler">Repo Profiler Github App</Link> from Github Marketplace in your org/personal account. Make sure you have the permissions required to install the app.</li>
        <li>For each repository, add the following Github Workflow code to use our Github Action - 
          <code>
            on:
              repository_dispatch:
                types: repo_profile_execution
            jobs:
              profile:
                runs-on: ubuntu-22.04
                steps:
                  - name: Checkout
                    uses: actions/checkout@v3
                    with:
                      fetch-depth: 0
                  - name: Repository Profiler
                    uses: Alokit-Innovations/repo-profiler@v0
          </code>
          The code should be added in a file named "repo-profiler.yml" present on the following path - ".github/workflows/repo-profiler.yml" inside the reposiotry.</li>
        <li>After installing Github app and adding Github Action to a repository, you should be able to see the Vibinex icon beside the name of the repository. This means your repository is all set up!!</li>
        <li>Go to the list of open Pull Requests in your repository. Relevant pull requests will be highlighted in yellow or red.</li>
        <li>Go to the "Files" tab in a pull request. Files relevant to you will be highlighted in yellow or red.</li>
      </ol>
      <h1 className="font-bold text-3xl">Setup Instructions - Bitbucket</h1>
      <ol className="list-decimal">
        <li>Log in/Sign up with Vibinex chrome-extension</li>
        <li>Install Vibinex OAuth Consumer in your personal/organization workspace. Make sure you have the permissions required to install oauth consumer.</li>
        <Button variant="contained" className="text-secondary-main" onClick={handleAuthorize}>Authorize Bitbucket OAuth Consumer</Button>
        <li>For each repository, add the following Bitbucket pipeline code to use our Bitbucket pipe - 
          <code>
          image: atlassian/default-image:4
          pipelines:
            - step:
                name: 'Run devprofiler'
                  script:
                    - pipe: docker://tapish303/repo-profiler-pipe:latest 
          </code>
          If this is your first pipeline, you may need to enable pipelines in your workspace.</li>
        <li>Add this code in "bitbucket-pipelines.yml".</li>
        <li>Go to the list of open Pull Requests in your repository. Relevant pull requests will be highlighted in yellowor red.</li>
        <li>Within a pull request, files relevant to you will be highlighted in yellow or red.</li>
      </ol>
    </div>
  );
}
