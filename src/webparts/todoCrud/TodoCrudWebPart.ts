import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneSlider} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TodoCrudWebPartStrings';
import TodoCrud from './components/TodoCrud';
import { ITodoCrudProps } from './components/ITodoCrudProps';
import { sp } from '@pnp/sp';

export interface ITodoCrudWebPartProps {
  description: string;
  myContinent: string;
  numContinentsVisited: number; 
}

export default class TodoCrudWebPart extends BaseClientSideWebPart<ITodoCrudWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<ITodoCrudProps> = React.createElement(
      TodoCrud,
      {
        description: this.properties.description,
        myContinent: this.properties.myContinent,
        numContinentsVisited: this.properties.numContinentsVisited,
        context:this.context
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Simple Description'
                }),
                PropertyPaneTextField('myContinent', {
                  label: 'Continent where I currently reside'
                }),
                PropertyPaneSlider('numContinentsVisited', {
                  label: 'Number of continents I\'ve visited',
                  min: 1, max: 7, showValue: true,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
