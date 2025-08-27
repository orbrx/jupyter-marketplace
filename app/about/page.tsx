/*
 * Copyright 2025, Orange Bricks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MarketplaceHeader } from "@/components/marketplace-header"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            About JupyterLab Marketplace
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  This is a community-run marketplace for JupyterLab extensions. It pulls public signals from PyPI (via BigQuery) and GitHub to make discovery less guessy—stars, recent updates, and download trends—so you can choose with more confidence.
                </p>
                
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Image 
                      src="/orbrx.svg" 
                      alt="Orange Bricks Logo" 
                      width={16} 
                      height={16} 
                      className="w-4 h-4 mr-2"
                    />
                    Built by{" "}
                    <a 
                      href="https://orbrx.io?utm_source=jlmp&utm_medium=about_page&utm_campaign=attribution" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-1 underline-offset-2 ml-1"
                    >
                      Orange Bricks
                    </a>
                    . Not affiliated with Project Jupyter.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Data Sources
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    PyPI download statistics via BigQuery
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    GitHub repository metrics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Extension metadata and descriptions
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Features
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Smart discovery with confidence metrics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Download trends (7/30-day, nightly refresh)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    GitHub activity indicators
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                How to Add Your Extension
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Getting your JupyterLab extension listed in this marketplace is simple—no need to contact us! Just publish your extension on PyPI with the correct Trove classifier, and it will appear in our catalog on the same day.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  Publishing Steps
                </h3>
                <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Ensure your extension includes the proper Trove classifier (e.g., <code className="text-sm bg-muted px-1 py-0.5 rounded">Framework :: Jupyter :: JupyterLab :: Extensions :: Prebuilt</code>) in your <code className="text-sm bg-muted px-1 py-0.5 rounded">setup.py</code> or <code className="text-sm bg-muted px-1 py-0.5 rounded">pyproject.toml</code></li>
                  <li>Publish your package to PyPI using standard Python packaging tools</li>
                  <li>Your extension will automatically appear in our catalog within 24 hours</li>
                </ol>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>📚 Learn More:</strong> For comprehensive information about JupyterLab extensions, Trove classifiers, and development guidelines, see the{" "}
                    <a 
                      href="https://jupyterlab.readthedocs.io/en/latest/user/extensions.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:no-underline font-medium"
                    >
                      official JupyterLab extensions documentation
                    </a>
                    .
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  Need Help Getting Started?
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We provide a{" "}
                  <a 
                    href="https://github.com/orbrx/extension-template-cursor?utm_source=jlmp&utm_medium=about_page&utm_campaign=dev_onramp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    new extension template with AI assistant instructions
                  </a>
                  , making it easy to go from your idea to publishing. The template includes everything you need to scaffold a modern JupyterLab extension.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  Extension Missing?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you're a maintainer and your extension is missing from our catalog, please{" "}
                  <a 
                    href="https://github.com/orbrx/jupyter-marketplace/issues/new/choose" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    send us feedback using GitHub issues
                  </a>
                  . We'll help troubleshoot and ensure your extension gets properly indexed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
