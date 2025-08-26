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
          
          <div className="grid md:grid-cols-2 gap-6">
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
                    Real-time download trends
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    GitHub activity indicators
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
